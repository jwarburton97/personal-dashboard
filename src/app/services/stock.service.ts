import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  // Using CORS proxy to access Yahoo Finance
  private corsProxy = 'https://corsproxy.io/?';
  private yahooApiUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';

  constructor(private http: HttpClient) {}

  getStockQuote(symbol: string): Observable<StockQuote> {
    const url = `${this.corsProxy}${encodeURIComponent(this.yahooApiUrl + '/' + symbol)}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        const result = response.chart.result[0];
        const quote = result.meta;
        const regularMarketPrice = quote.regularMarketPrice;
        const previousClose = quote.previousClose || quote.chartPreviousClose;
        const change = regularMarketPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        return {
          symbol: result.meta.symbol,
          name: result.meta.longName || result.meta.shortName || symbol,
          price: regularMarketPrice,
          change: change,
          changePercent: changePercent,
          high: quote.regularMarketDayHigh || 0,
          low: quote.regularMarketDayLow || 0,
          open: quote.regularMarketOpen || 0,
          previousClose: previousClose,
          volume: quote.regularMarketVolume || 0
        };
      }),
      catchError(error => {
        console.error(`Error fetching ${symbol}:`, error);
        return of(null as any);
      })
    );
  }

  getMultipleStocks(symbols: string[]): Observable<StockQuote[]> {
    const requests = symbols.map(symbol => this.getStockQuote(symbol));
    return forkJoin(requests).pipe(
      map(results => results.filter(r => r !== null))
    );
  }
}
