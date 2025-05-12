import { Card, CardHeader, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function SkeletonCard() {
    return (
        <Skeleton className="w-xs h-30 rounded-xl">
            <Card className="w-full h-full">
                <CardHeader>
                    <Skeleton className="w-3/4 h-3" />
                </CardHeader>
                <CardContent className="h-full">
                    <Skeleton className="w-4/5 h-full" />
                </CardContent>
            </Card>
        </Skeleton>
    );
}
