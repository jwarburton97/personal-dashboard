import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, StockQuote } from '../../services/stock.service';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent implements OnInit {
  stocks: StockQuote[] = [];
  loading = true;
  error = '';
  expanded = false;
  selectedStock: StockQuote | null = null;

  // Default watchlist (user can customize later)
  watchlist = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'];
  newSymbol = '';

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.loading = true;
    this.error = '';

    this.stockService.getMultipleStocks(this.watchlist).subscribe({
      next: (data) => {
        this.stocks = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load stock data';
        this.loading = false;
        console.error('Stock error:', err);
      }
    });
  }

  addStock() {
    if (this.newSymbol && !this.watchlist.includes(this.newSymbol.toUpperCase())) {
      this.watchlist.push(this.newSymbol.toUpperCase());
      this.newSymbol = '';
      this.loadStocks();
    }
  }

  removeStock(symbol: string) {
    this.watchlist = this.watchlist.filter(s => s !== symbol);
    this.stocks = this.stocks.filter(s => s.symbol !== symbol);
  }

  expandStock(stock: StockQuote) {
    this.selectedStock = stock;
    this.expanded = true;
  }

  closeExpanded() {
    this.expanded = false;
    this.selectedStock = null;
  }

  refreshStocks() {
    this.loadStocks();
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  formatChange(change: number): string {
    return change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  }

  formatPercent(percent: number): string {
    return percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`;
  }

  formatVolume(volume: number): string {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(2) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(2) + 'K';
    }
    return volume.toString();
  }
}
