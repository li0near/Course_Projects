import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as D3 from 'D3';
import {interpolateNumber} from 'd3-interpolate';
import {plotLine} from './line-chart.js';

interface MarginTemplate {

  top: number;
  right: number;
  bottom: number;
  left: number;

}
interface Row {

  date: string;
  Adjclose: number;
  Open: number;

}
interface DataType {
  x: any ;
  y1: any;
  y2: any;
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {


  constructor() {

  }

  ngOnInit() {


    plotLine();

  }

  }
