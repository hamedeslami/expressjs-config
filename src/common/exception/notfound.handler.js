export default function NotFoundHandler(app) {
    app.use((req, res, next) => {
        res.status(404).json({
            statusCode: 404,
            message: "not found"
        });
    });
}
