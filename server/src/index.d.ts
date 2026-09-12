import "dotenv/config";
declare module "express-session" {
    interface SessionData {
        userId?: number;
        cart: {
            productId: string;
            quantity: number;
        }[];
    }
}
//# sourceMappingURL=index.d.ts.map