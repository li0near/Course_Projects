import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TheoryChartComponent } from './theory-chart/theory-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    TheoryChartComponent,
    LineChartComponent,
    BarChartComponent,
    WorldMapComponent,
    HeatMapComponent,
    DonutChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
