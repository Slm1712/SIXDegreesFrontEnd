import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { usuariosDTO } from 'src/app/interfaces/usuariosDTO';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { fromMatPaginator, fromMatSort, paginateRows, sortRows } from 'src/app/utils/data-utils';
import { single } from './data';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
    
  
  /* PAGINACION */
  @ViewChild(MatPaginator, { read: MatPaginator, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  
  optData = 0;

  // TODO: variables grid, filtros
  listUsuarios: Array<usuariosDTO>=[]
  
  displayedRows$: Observable<usuariosDTO[]> | undefined;
  displayedRowsOutFilters$: Observable<usuariosDTO[]> | undefined;
  displayedRowsDetalle$: Observable<usuariosDTO[]> | undefined;
  totalRows$: Observable<number> | undefined;
  length=0;
  pageSize = 5;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];


  constructor(private UsuariosService: UsuariosService) {
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.UsuariosService.getUsuarios().subscribe(resp=>{
      this.listUsuarios=[]
      resp.table.forEach((element: usuariosDTO) => {
        this.listUsuarios.push(element)
      });
    },error=>{

    },()=>{
      const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
      const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

      const rows$ = of(this.listUsuarios);

      this.totalRows$ = rows$.pipe(map(rows => rows.length));
      this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
      this.displayedRowsOutFilters$ = this.displayedRows$;
    })
  }

}
