import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

export function PaginationComponent({query, page, numberOfGames, itemsOnPage}: {query: string, page: number, numberOfGames: number, itemsOnPage: number}) {
    const lastPage = Math.ceil(numberOfGames / itemsOnPage)

    const previousPage = page === 1 ? 1 : page - 1;
    const nextPage = page >= lastPage ? lastPage : page + 1;

    return (
        <Pagination className="text-white">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={`?query=${query}&page=${previousPage.toString()}`} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={`?query=${query}&page=${page.toString()}`}>{page.toString()}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href={`?query=${query}&page=${nextPage.toString()}`} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}