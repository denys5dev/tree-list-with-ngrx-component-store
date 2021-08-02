import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { DxTreeListComponent } from 'devextreme-angular/ui/tree-list';
import 'devextreme/data/odata/store';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { DataStore } from './state/data.store';

// this.id = Guid.create();
@Component({
  templateUrl: 'tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [DataStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {
  @ViewChild('tree') treeList: DxTreeListComponent | undefined;
  dataSource$: Observable<any[]> = this.store.data$;
  selectedNode$: Observable<any[]> = this.store.selectedNode$;
  constructor(private readonly store: DataStore) {}

  addChildNode(cellInfo: any) {
    this.store.add(cellInfo);
    this.treeList?.instance.refresh();
    this.treeList?.instance.expandRow(cellInfo?.key ? cellInfo.key : 0);
  }

  deleteNode(cellInfo: any) {
    this.store.deleteNode(cellInfo);
    this.treeList?.instance.refresh();
  }

  updateNode(cellInfo: any) {
    this.store.selectNode(cellInfo);
    this.selectedNode$.subscribe((data) => alert(JSON.stringify(data)));
  }

  save() {
    this.dataSource$.subscribe((data) => console.log(data));
  }
}
