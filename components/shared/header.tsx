import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Container from "./container";
import Link from "next/link";

export default function Header() {
    return (
        <header className="py-4 mb-12 mt-8">
            <Container>
                <div className="flex justify-between items-center">
                    <Link href="/dashboard" className="font-bold hover:opacity-80 transition-opacity">
                        Invoice Now
                    </Link>
                    <div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </Container>
        </header>
    )
}