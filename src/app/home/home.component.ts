import {Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {first} from 'rxjs/operators';
// @ts-ignore
import {AvisExec} from '@app/_models';
// @ts-ignore
import {AvisExecService} from '@app/_services';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { asc: 'desc', desc: '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'th[sortable]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NabSortableHeaderDirective {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = false;
  allAvis: AvisExec[];
  sortedAvis: AvisExec[];

  @ViewChildren(NabSortableHeaderDirective) headers: QueryList<NabSortableHeaderDirective>;

  constructor(private avisExecService: AvisExecService) {
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '') {
      this.sortedAvis = this.allAvis;
    } else {
      this.sortedAvis = [...this.allAvis].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  ngOnInit() {
    this.loading = true;
    this.avisExecService.getAll().pipe(first()).subscribe(allAvis => {
      this.loading = false;
      this.sortedAvis = allAvis;
      this.allAvis = allAvis;
    });
  }

   cellStyle(value, row, index) {
    alert('aaa');
    var classes = ['active', 'success', 'info', 'warning', 'danger'];

    if (index % 2 === 0 && index / 2 < classes.length) {
      return {
        classes: classes[index / 2]
      };
    }
    return {};
  }
}

