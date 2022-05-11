import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PaginateResult } from "../_models/pagination";

export function getPaginateResult<T>(url: string, params: HttpParams, http:HttpClient): Observable<PaginateResult<T>> {
    const paginatedResult: PaginateResult<T> = new PaginateResult<T>();
    
    return http.get<T>(url, { observe: "response", params }).pipe(
        map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get("Pagination") !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
        }
        return paginatedResult;
        })
    );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    params = params.append("pageNumber", pageNumber.toString());
    params = params.append("pageSize", pageSize.toString());

    return params;
}