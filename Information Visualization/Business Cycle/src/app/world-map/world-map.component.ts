//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import {plotMap} from './functions.js';

@Component({
    selector: 'app-world-map',
    templateUrl: './world-map.component.html',
    styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        
        plotMap();

    }

}
