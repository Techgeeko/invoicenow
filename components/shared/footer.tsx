import Container from "./container";

export default function Footer() {
    return (
        <footer className="py-4 mb-8 mt-6">
            <Container className="flex justify-between gap-4">
                <p className="text-sm">
                    Invoice Now &copy; {new Date().getFullYear()}
                </p>
                <p className="text-sm">
                    Created by Techgeeko with Next.js, Xata, and Clerk
                </p>
            </Container>
        </footer>
    )
}