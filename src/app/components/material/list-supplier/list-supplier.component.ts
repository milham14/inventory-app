import { Component, AfterViewInit,OnInit,PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { PermissionService } from '../../../services/permission/permission.service';

declare var $: any; // Mengakses jQuery yang sudah ada di global scope
declare var moment: any;

@Component({
  standalone: true,
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, FormsModule]
})
export class ListSupplierComponent implements AfterViewInit, OnInit {
  isBrowser: boolean = false;
  allPermissions: any[] = [];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

   // if (this.isBrowser) {
      // setiap selesai navigasi, init ulang Select2
     // this.router.events
        //.pipe(filter(e => e instanceof NavigationEnd))
       // .subscribe(() => this.initSelect2());
   // }

    this.LoadPermissions();
  }

  ngAfterViewInit(): void {
    // Kalau server-side (Angular Universal), skip
    if (!this.isBrowser) {
      return;
    }
  
    // Init sekali waktu load pertama
    this.initSelect2();
    this.initForm();
  
    // Re-init Select2 (dan Form plugins) setiap kartu di-expand
    $(document)
      .off('expanded.lte.cardwidget')
      .on('expanded.lte.cardwidget', () => {
        this.reinitSelect2();
        this.reinitForm();      // <— tambahkan ini kalau datepicker/daterange/duallistbox perlu re-init
      });
  }
  
  
  

  private initSelect2() {
    setTimeout(() => {
      // Default theme
      $('.select2').each((_: any, el: any) => {
        const $el = $(el);
        if (!$el.data('select2')) {
          $el.select2();
        }
      });
      // Bootstrap4 theme
      $('.select2bs4').each((_: any, el: any) => {
        const $el = $(el);
        if (!$el.data('select2')) {
          $el.select2({ theme: 'bootstrap4' });
        }
      });
    }, 0);
  }
  
  private reinitSelect2() {
    setTimeout(() => {
      // Default theme
      $('.select2').each((_: any, el: any) => {
        const $el = $(el);
        if ($el.data('select2')) {
          $el.select2('destroy');
        }
        $el.select2();
      });
      // Bootstrap4 theme
      $('.select2bs4').each((_: any, el: any) => {
        const $el = $(el);
        if ($el.data('select2')) {
          $el.select2('destroy');
        }
        $el.select2({ theme: 'bootstrap4' });
      });
    }, 0);
  }

  private reinitForm(): void {
    setTimeout(() => {
      // Hanya contoh, ulangi guard & destroy+init seperti di initForm
      const $date = $('#reservationdate');
      if ($date.length) {
        // destroy dulu kalau ada API destroy-nya, misal
        $date.datetimepicker('destroy');
        $date.datetimepicker({ format: 'L' });
      }
  
      const $range = $('#reservationtime');
      if ($range.length) {
        $range.data('daterangepicker')?.remove();   // hapus instance lama
        $range.daterangepicker({
          timePicker: true,
          timePickerIncrement: 30,
          locale: { format: 'MM/DD/YYYY hh:mm A' }
        });
      }
  
      // ulangi untuk duallistbox, colorpicker, switch, dsb.
    }, 0);
  }
  
  

  initForm(): void {
    setTimeout(() => {

      //Datemask dd/mm/yyyy
$('#datemask').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' })
//Datemask2 mm/dd/yyyy
$('#datemask2').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })
//Money Euro
$('[data-mask]').inputmask()

//Date picker
$('#reservationdate').datetimepicker({
format: 'L'
});

//Date and time picker
$('#reservationdatetime').datetimepicker({ icons: { time: 'far fa-clock' } });

//Date range picker
$('#reservation').daterangepicker()
//Date range picker with time picker
$('#reservationtime').daterangepicker({
timePicker: true,
timePickerIncrement: 30,
locale: {
format: 'MM/DD/YYYY hh:mm A'
}
})
//Date range as a button
$('#daterange-btn').daterangepicker(
{
ranges   : {
'Today'       : [moment(), moment()],
'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
'Last 30 Days': [moment().subtract(29, 'days'), moment()],
'This Month'  : [moment().startOf('month'), moment().endOf('month')],
'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
},
startDate: moment().subtract(29, 'days'),
endDate  : moment()
},
function (start: { format: (arg0: string) => string; }, end: { format: (arg0: string) => string; }) {
$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
}
)

//Timepicker
$('#timepicker').datetimepicker({
format: 'LT'
})

//Bootstrap Duallistbox
$('.duallistbox').bootstrapDualListbox()

//Colorpicker
$('.my-colorpicker1').colorpicker()
//color picker with addon
$('.my-colorpicker2').colorpicker()

$('.my-colorpicker2').on('colorpickerChange', function(event: { color: { toString: () => any; }; }) {
$('.my-colorpicker2 .fa-square').css('color', event.color.toString());
})

$("input[data-bootstrap-switch]").each(() =>{
$(this).bootstrapSwitch('state', $(this).prop('checked'));
})

},0);
  }

  LoadPermissions() {
    this.permissionService.getPermissions().subscribe((data) => {
      this.allPermissions = data;
    })
  }

}
