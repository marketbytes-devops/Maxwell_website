from sqlalchemy import text


def build_category_tree(rows: list[dict]) -> list[dict]:
    """Build nested category trees (Main -> Sub -> Sub-sub) from flat rows."""
    nodes = {}
    for row in rows:
        node = dict(row)
        node["children"] = []
        nodes[node["id"]] = node

    roots = []
    for node in nodes.values():
        parent_id = node.get("parent_id")
        if parent_id and parent_id in nodes:
            nodes[parent_id]["children"].append(node)
        else:
            roots.append(node)

    def assign_paths(node: dict, prefix: list[str]) -> None:
        path = [*prefix, node["name"]]
        node["full_path"] = " > ".join(path)
        for child in node["children"]:
            assign_paths(child, path)

    for root in roots:
        assign_paths(root, [])

    return roots


def get_descendant_category_ids(conn, root_category_id: int) -> list[int]:
    """Return root_category_id and all descendant subcategory IDs."""
    rows = conn.execute(text("SELECT id, parent_id FROM categories")).fetchall()
    children_map: dict[int | None, list[int]] = {}
    for cid, pid in rows:
        children_map.setdefault(pid, []).append(cid)

    result = []
    stack = [root_category_id]
    visited = set()
    while stack:
        current = stack.pop()
        if current in visited:
            continue
        visited.add(current)
        result.append(current)
        stack.extend(children_map.get(current, []))
    return result


def get_category_breadcrumb(conn, category_id: int | None) -> list[dict]:
    """Return ancestor chain from Level 1 category down to category_id."""
    if not category_id:
        return []

    rows = conn.execute(text("SELECT id, parent_id, name, slug, level FROM categories")).fetchall()
    by_id = {
        r[0]: {"id": r[0], "parent_id": r[1], "name": r[2], "slug": r[3], "level": r[4]}
        for r in rows
    }

    chain = []
    curr = by_id.get(category_id)
    visited = set()
    while curr and curr["id"] not in visited:
        visited.add(curr["id"])
        chain.append({
            "id": curr["id"],
            "name": curr["name"],
            "slug": curr["slug"],
            "level": curr["level"],
        })
        curr = by_id.get(curr["parent_id"]) if curr.get("parent_id") else None

    chain.reverse()
    return chain


def attach_product_details(conn, products: list[dict]) -> list[dict]:
    """Attach specifications, images/gallery, and category breadcrumb to product dicts."""
    if not products:
        return products

    cat_rows = conn.execute(text("SELECT id, parent_id, name, slug, level FROM categories")).fetchall()
    cat_by_id = {
        r[0]: {"id": r[0], "parent_id": r[1], "name": r[2], "slug": r[3], "level": r[4]}
        for r in cat_rows
    }

    for prod in products:
        pid = prod["id"]
        spec_rows = conn.execute(
            text(
                """
                SELECT id, spec_key, spec_value
                FROM product_specifications
                WHERE product_id = :pid
                ORDER BY display_order ASC, id ASC
                """
            ),
            {"pid": pid},
        ).mappings().all()
        prod["specifications"] = [dict(s) for s in spec_rows]

        img_rows = conn.execute(
            text(
                """
                SELECT id, image_url, is_primary, display_order
                FROM product_images
                WHERE product_id = :pid
                ORDER BY is_primary DESC, display_order ASC, id ASC
                """
            ),
            {"pid": pid},
        ).mappings().all()
        images = [dict(im) for im in img_rows]
        prod["images"] = images

        gallery = [im["image_url"] for im in images if im.get("image_url")]
        if not gallery and prod.get("image_url"):
            gallery = [prod["image_url"]]
        prod["gallery"] = gallery
        if not prod.get("image_url") and gallery:
            prod["image_url"] = gallery[0]

        # Build category breadcrumb
        chain = []
        curr = cat_by_id.get(prod.get("category_id"))
        visited = set()
        while curr and curr["id"] not in visited:
            visited.add(curr["id"])
            chain.append({
                "id": curr["id"],
                "name": curr["name"],
                "slug": curr["slug"],
                "level": curr["level"],
            })
            curr = cat_by_id.get(curr["parent_id"]) if curr.get("parent_id") else None
        chain.reverse()
        prod["breadcrumb"] = chain
        prod["category_path"] = " > ".join(item["name"] for item in chain) or prod.get("category_name", "")

    return products
