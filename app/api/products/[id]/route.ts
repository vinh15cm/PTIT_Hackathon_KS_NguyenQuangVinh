import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

interface Product {
    id: number;
    productName: string;
    price: number;
    image: string;
    quantity: number;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const filePath = path.join(process.cwd(), "database", "products.json");
        const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const findProductId = products.find(
            (product: Product) => product.id === +params.id
        );
        if (findProductId) {
            return NextResponse.json(findProductId);
        } else {
            return NextResponse.json({ message: "Không tìm thấy sản phẩm" });
        }
    } catch (error) {
        return NextResponse.json(error);
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const updateProduct = await req.json();
        const filePath = path.join(process.cwd(), "database", "products.json");
        const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const findIndex = products.findIndex(
            (product: Product) => product.id == +params.id
        );
        if (findIndex !== -1) {
            products[findIndex] = updateProduct;
            fs.writeFileSync(filePath, JSON.stringify(products), "utf8");
            return NextResponse.json({
                message: "Cập nhập thành công",
                data: updateProduct,
            });
        } else {
            return NextResponse.json({
                message: "Không tìm thấy sản phẩm cần cập nhật",
            });
        }
    } catch (error) {
        return NextResponse.json(error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const filePath = path.join(process.cwd(), "database", "products.json");
        const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const findIndex = products.findIndex(
            (product: Product) => product.id == +params.id
        );
        if (findIndex !== -1) {
            const newProducts = products.filter(
                (product: any) => product.id !== +params.id
            );
            fs.writeFileSync(filePath, JSON.stringify(newProducts), "utf8");
            return NextResponse.json({
                message: "Xóa thành công",
                data: newProducts,
            });
        } else {
            return NextResponse.json({ message: "Không tìm thấy sản phẩm cần xóa" });
        }
    } catch (error) {
        return NextResponse.json(error);
    }
}