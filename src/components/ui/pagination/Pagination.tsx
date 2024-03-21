'use client'
import { generatePaginationNumbers } from '@/utils'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import clsx from 'clsx';

interface Props {
    total: number
}

export const Pagination = ({ total }: Props) => {

    const pathName = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page') ?? '1');
    const allpages = generatePaginationNumbers(currentPage, total);

    const createPageUrl = (page: number | string) => {
        const params = new URLSearchParams(searchParams);
        if (page === '...') {
            return `${pathName}?${params.toString()}`;
        }
        if (+page <= 0) {
            return `${pathName}`
        }
        if (+page > total) {
            return `${pathName}?${params.toString()}`
        }

        params.set('page', page.toString());
        return `${pathName}?${params.toString()}`
    };

    return (
        <div className="flex justify-center">
            <nav aria-label="Page navigation example">
                <ul className="flex list-style-none">
                    <li className="page-item disabled">
                        <Link
                            className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-500 pointer-events-none focus:shadow-none"
                            href={createPageUrl(currentPage - 1)} aria-disabled="true">
                            <IoChevronBackOutline size={30} />
                        </Link>
                    </li>
                    {
                        allpages.map((page, index) => (
                            <li key={page + "-" + index} className="page-item">
                                <Link
                                    className={
                                        clsx("page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none", 
                                        { 'bg-blue-700 shadow-sm text-white hover:text-white hover:bg-blue-700': page === currentPage })
                                    }
                                    href={createPageUrl(page)}>{page}
                                </Link>
                            </li>
                        ))
                    }


                    <li className="page-item">
                        <Link
                            className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                            href={createPageUrl(currentPage + 1)}>
                            <IoChevronForwardOutline size={30} />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div >
    )
}
