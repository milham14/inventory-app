import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';

declare var $: any;  // Pastikan jQuery dikenali
declare var Chart: any;  // Pastikan Chart.js dikenali
declare var Sparkline: any;
declare var moment: any;

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [ CommonModule]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  isBrowser: boolean = false;

  constructor( 
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
   ) {
   }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId)

   // if (this.isBrowser) {
     // this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.initDashboard());
   // }
    // Simulasi loading (bisa diganti pas ambil data dari API nanti)
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initDashboard()
    }
  }

  ngOnDestroy(): void {
    // Membersihkan event listeners atau inisialisasi lain yang tidak diperlukan setelah komponen di-destroy
    if (this.isBrowser) {
      // Contoh: Stop jQuery event atau plugin saat keluar halaman
      $('.connectedSortable').sortable('destroy');
      $('.todo-list').sortable('destroy');
      $('.textarea').summernote('destroy');
      $('.connectedSortable .card-header').css('cursor', 'move')
      // Hapus event lainnya sesuai kebutuhan
    }
  }

  initDashboard(): void {

    if (this.isBrowser) {

    $('.connectedSortable').sortable({
      placeholder: 'sort-highlight',
      connectWith: '.connectedSortable',
      handle: '.card-header, .nav-tabs',
      forcePlaceholderSize: true,
      zIndex: 999999
    });
    $('.connectedSortable .card-header').css('cursor', 'move');

    $('.todo-list').sortable({
      placeholder: 'sort-highlight',
      handle: '.handle',
      forcePlaceholderSize: true,
      zIndex: 999999
    });

    $('.textarea').summernote();

    $('.daterange').daterangepicker({
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      startDate: moment().subtract(29, 'days'),
      endDate: moment()
    }, function (start: { format: (arg0: string) => string; }, end: { format: (arg0: string) => string; }) {
      alert('You chose: ' + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    });

    $('.knob').knob();

    const visitorsData: { [key: string]: number } = {
      US: 398,
      SA: 400,
      CA: 1000,
      DE: 500,
      FR: 760,
      CN: 300,
      AU: 700,
      BR: 600,
      IN: 800,
      GB: 320,
      RU: 3000
    };
    
    $('#world-map').vectorMap({
      map: 'usa_en',
      backgroundColor: 'transparent',
      regionStyle: {
        initial: {
          fill: 'rgba(255, 255, 255, 0.7)',
          'fill-opacity': 1,
          stroke: 'rgba(0,0,0,.2)',
          'stroke-width': 1,
          'stroke-opacity': 1
        }
      },
      series: {
        regions: [{
          values: visitorsData,
          scale: ['#ffffff', '#0154ad'],
          normalizeFunction: 'polynomial'
        }]
      },
      onRegionLabelShow: function (e: any, el: any, code: string) {
        // Periksa apakah 'code' ada di 'visitorsData'
        if (visitorsData[code]) {
          // Ambil current html terlebih dahulu dan pastikan tidak null atau undefined
          let currentHtml = el.html() || '';
    
          // Tambahkan informasi ke currentHtml
          el.html(currentHtml + ': ' + visitorsData[code] + ' new visitors'); // Gunakan el.html(arg0) untuk set nilai
        }
      }
    });
    
    
    

    const sparkline1 = new Sparkline($('#sparkline-1')[0], { width: 80, height: 50, lineColor: '#92c1dc', endColor: '#ebf4f9' });
    const sparkline2 = new Sparkline($('#sparkline-2')[0], { width: 80, height: 50, lineColor: '#92c1dc', endColor: '#ebf4f9' });
    const sparkline3 = new Sparkline($('#sparkline-3')[0], { width: 80, height: 50, lineColor: '#92c1dc', endColor: '#ebf4f9' });

    sparkline1.draw([1000, 1200, 920, 927, 931, 1027, 819, 930, 1021]);
    sparkline2.draw([515, 519, 520, 522, 652, 810, 370, 627, 319, 630, 921]);
    sparkline3.draw([15, 19, 20, 22, 33, 27, 31, 27, 19, 30, 21]);

    $('#calendar').datetimepicker({
      format: 'L',
      inline: true
    });

    $('#chat-box').overlayScrollbars({
      height: '250px'
    });

// Sales Chart (Line Chart)
const salesChartCanvas = document.getElementById('revenue-chart-canvas') as HTMLCanvasElement | null;

if (salesChartCanvas) {
  const salesChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Digital Goods',
        backgroundColor: 'rgba(60,141,188,0.9)',
        borderColor: 'rgba(60,141,188,0.8)',
        pointRadius: false,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data: [28, 48, 40, 19, 86, 27, 90]
      },
      {
        label: 'Electronics',
        backgroundColor: 'rgba(210, 214, 222, 1)',
        borderColor: 'rgba(210, 214, 222, 1)',
        pointRadius: false,
        pointColor: 'rgba(210, 214, 222, 1)',
        pointStrokeColor: '#c1c7d1',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  const salesChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    }
  };

  const ctxSalesChart = salesChartCanvas.getContext('2d');
  if (ctxSalesChart) {
    new Chart(ctxSalesChart, {
      type: 'line',
      data: salesChartData,
      options: salesChartOptions
    });
  }
}

// Pie Chart (Doughnut Chart)
const pieChartCanvas = document.getElementById('sales-chart-canvas') as HTMLCanvasElement | null;

if (pieChartCanvas) {
  const pieData = {
    labels: ['Instore Sales', 'Download Sales', 'Mail-Order Sales'],
    datasets: [{
      data: [30, 12, 20],
      backgroundColor: ['#f56954', '#00a65a', '#f39c12']
    }]
  };
  
  const pieOptions = {
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true
  };

  const ctxPieChart = pieChartCanvas.getContext('2d');
  if (ctxPieChart) {
    new Chart(ctxPieChart, {
      type: 'doughnut',
      data: pieData,
      options: pieOptions
    });
  }
}

// Sales Graph Chart (Line Chart)
const salesGraphChartCanvas = document.getElementById('line-chart') as HTMLCanvasElement | null;

if (salesGraphChartCanvas) {
  const salesGraphChartData = {
    labels: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2', '2012 Q3', '2012 Q4', '2013 Q1', '2013 Q2'],
    datasets: [{
      label: 'Digital Goods',
      fill: false,
      borderWidth: 2,
      lineTension: 0,
      spanGaps: true,
      borderColor: '#efefef',
      pointRadius: 3,
      pointHoverRadius: 7,
      pointColor: '#efefef',
      pointBackgroundColor: '#efefef',
      data: [2666, 2778, 4912, 3767, 6810, 5670, 4820, 15073, 10687, 8432]
    }]
  };

  const salesGraphChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        ticks: {
          fontColor: '#efefef'
        },
        gridLines: {
          display: false,
          color: '#efefef',
          drawBorder: false
        }
      }],
      yAxes: [{
        ticks: {
          stepSize: 5000,
          fontColor: '#efefef'
        },
        gridLines: {
          display: true,
          color: '#efefef',
          drawBorder: false
        }
      }]
    }
  };

  const ctxSalesGraphChart = salesGraphChartCanvas.getContext('2d');
  if (ctxSalesGraphChart) {
    new Chart(ctxSalesGraphChart, {
      type: 'line',
      data: salesGraphChartData,
      options: salesGraphChartOptions
    });
  }
}

  }
  
}

}
