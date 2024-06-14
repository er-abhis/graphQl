import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() totalPage: any;
  @Input() currentPage: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  activePage: number=1;

  constructor() {}
  ngOnInit() {}
  previousPage() {
    this.pageChange.emit(this.currentPage - 1);
    this.activePage=this.currentPage-1;

  }

  nextPage() {
    this.pageChange.emit(this.currentPage + 1);
    this.activePage=this.currentPage+1;
  }

  goToPage(pageNumber: number) {
    this.pageChange.emit(pageNumber);
    this.activePage=pageNumber;
  }
  visiblePages(): number[] {
    const start = Math.max(1, this.currentPage - 2); // Start index for visible pages
    const end = Math.min(this.totalPage?.length, start + 4); // End index for visible pages
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // Method to return the actual page number corresponding to the given index in the visible pages array
  visiblePageIndex(index: number): number {
    return this.visiblePages()[index];
  }

  previousSequence() {
    if (this.currentPage - 5 >= 1) {
      this.currentPage -= 5;
    } else {
      this.currentPage = 1;
    }
  }

  nextSequence() {
    if (this.currentPage + 5 <= this.totalPage.length) {
      this.currentPage += 5;
    } else {
      this.currentPage = this.totalPage.length;
    }
  }
}
