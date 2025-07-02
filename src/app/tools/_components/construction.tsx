import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hammer, Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnderConstruction({
	description,
	longDescription,
}: {
	description: string;
	longDescription?: string;
}) {
	return (
		<div className="flex flex-col gap-6 mx-auto w-full max-w-[1600px] p-6">
			<div className="flex flex-col items-center justify-center min-h-[70vh]">
				<Card className="w-full max-w-md border-2 border-amber-500/20 shadow-lg">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 p-4 rounded-full bg-amber-100 dark:bg-amber-900/20">
							<Construction className="h-12 w-12 text-amber-500" />
						</div>
						<CardTitle className="text-2xl font-bold">Under Construction</CardTitle>
						<CardDescription className="text-lg">{description}</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="mb-4">{longDescription}</p>
						<div className="flex items-center justify-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md">
							<Hammer className="h-5 w-5 text-amber-500" />
							<p className="font-medium">Check back soon for updates!</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							asChild
							variant="outline"
							className="w-full"
						>
							<Link href="/tools">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Tools
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
