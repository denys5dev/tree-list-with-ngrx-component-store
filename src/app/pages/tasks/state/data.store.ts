import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { first, last, map, switchMap, take, takeLast } from 'rxjs/operators';

export interface DataStoreState {
  data: any[];
  selected?: any;
}

@Injectable()
export class DataStore extends ComponentStore<DataStoreState> {
  readonly data$: Observable<any[]> = this.select((state) => state.data);
  readonly selectedNode$: Observable<any[]> = this.select(
    (state) => state.selected
  ).pipe(
    map((data) => data.node[data.index]),
    take(1)
  );
  constructor() {
    super({
      selected: null,
      data: [
        {
          id: Guid.create().toString(),
          name: 'first',
          description: 'desc',
          children: [
            {
              id: Guid.create().toString(),
              name: 'second',
              description: 'desc',
              children: [],
            },
          ],
        },
      ],
    });
  }

  add(cellInfo: any) {
    this.setState((state) => ({
      ...state,
      data: this.addItem(cellInfo, state.data),
    }));
  }

  deleteNode(cellInfo: any) {
    this.setState((state) => ({
      ...state,
      data: this.removeNode(cellInfo, state.data),
    }));
  }

  addItem(cellInfo: any, source: any[]) {
    if (!cellInfo) {
      source.push({
        id: Guid.create().toString(),
        name: Guid.create().toString(),
        children: [],
      });

      return source;
    }
    const id = cellInfo.data.id;

    const target = this.findNode(source, id);
    const targetNode = target.node[target.index];
    targetNode.children = [
      ...targetNode.children,
      {
        id: Guid.create().toString(),
        name: Guid.create().toString(),
        children: [],
      },
    ];
    return source;
  }

  findNode(data: any[], id: string): any {
    const dataArray = data;
    for (let i = 0; i < dataArray.length; i += 1) {
      if (dataArray[i].id == id) {
        const target = {
          node: data,
          index: i,
        };
        return target;
      } else if (dataArray[i].children) {
        const target = this.findNode(dataArray[i].children, id);
        if (target) {
          return target;
        }
      }
    }
  }

  removeNode(cellInfo: any, source: any[]): any {
    const id = cellInfo.data.id;
    if (!id) {
      return;
    }
    const target = this.findNode(source, id);

    target.node.splice(target.index, 1);
    console.log(source);
    return source;
  }

  selectNode(cellInfo: any) {
    this.setState((state) => ({
      ...state,
      selected: this.findNode(state.data, cellInfo.data.id),
    }));
  }
}
