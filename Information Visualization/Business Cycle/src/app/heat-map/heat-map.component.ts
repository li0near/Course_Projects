import { Component, OnInit } from '@angular/core';
import { plot } from "./function.js";
@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.css']
})
export class HeatMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    plot();
    window.onresize = plot;
  }

}
