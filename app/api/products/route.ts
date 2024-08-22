import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

interface Product {
    id: number;
    productName: string;
    price: number;
    image: string;
    quantity: number;
}

export async function GET(req: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), "database", "products.json");
        const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const { searchParams } = new URL(req.url);
        const nameQuery = searchParams.get("productName")?.toLowerCase();
        // nếu không có query parameter "productName" trả về toàn bộ danh sách sản phẩm
        if (!nameQuery) {
            return NextResponse.json(products);
        }
        const matchingProducts = products.filter((product: Product) =>
            product.productName.toLowerCase().includes(nameQuery)
        );

        if (matchingProducts.length === 0) {
            return NextResponse.json({
                message: `Không tìm thấy người dùng nào với tên: ${nameQuery}`,
            });
        }
    } catch (error) {
        return NextResponse.json(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const newProduct = await req.json();
        const filePath = path.join(process.cwd(), "database", "products.json");
        const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const maxId = products.reduce(
            (max: number, product: Product) => Math.max(max, product.id),
            0
        );

        // Gán id mới lớn hơn id lớn nhất
        newProduct.id = maxId + 1;
        products.push(newProduct);
        fs.writeFileSync(filePath, JSON.stringify(products));
        return NextResponse.json({
            message: "Thêm mới thành công",
            data: products,
        });
    } catch (error) {
        return NextResponse.json(error);
    }
}