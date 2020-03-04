﻿import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../environments/environment';
import {AvisExec} from '../_models';

@Injectable({ providedIn: 'root' })
export class AvisExecService {
  constructor(private http: HttpClient) { }

  getAll() {
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa('ccf:ccfSWIFT2020') });
    return this.http.get<AvisExec[]>(`${environment.apiUrl}/avis-exec/all`, {headers});
  }
}
