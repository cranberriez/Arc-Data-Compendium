import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";

export default function AdminPage() {
	return (
		<ClerkProvider>
			<article className="w-full p-4">
				<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
					<header className="flex justify-end items-center p-4 gap-4 h-16">
						<SignedOut>
							<SignInButton />
							<SignUpButton />
						</SignedOut>
						<SignedIn>
							<UserButton />
						</SignedIn>
					</header>
				</div>
			</article>
		</ClerkProvider>
	);
}
