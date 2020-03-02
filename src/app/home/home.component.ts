import {Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {first} from 'rxjs/operators';
// @ts-ignore
import {User} from '@app/_models';
// @ts-ignore
import {UserService, AuthenticationService} from '@app/_services';

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

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
  loading = false;
  users: User[];
  sortedUsers: User[];

  @ViewChildren(NabSortableHeaderDirective) headers: QueryList<NabSortableHeaderDirective>;

  constructor(private userService: UserService) {
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.loading = false;

    if (direction === '') {
      this.sortedUsers = this.users;
    } else {
      this.sortedUsers = [...this.users].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
  ngOnInit() {
    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.loading = false;
      this.sortedUsers = users;
      this.users = users;
    });
  }
}

