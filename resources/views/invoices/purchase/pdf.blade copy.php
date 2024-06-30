<!DOCTYPE html>
<html lang="en">

<head>

    <title>Document</title>
    <style>
        body {
            border: double 1px #000;
            height: 210mm;
            width: 123mm;
            box-sizing: border-box;
            font-size: .6rem;
        }

        .td,
        .tr,
        .th {
            font-size: .5rem;
        }

        .border {
            border-collapse: collapse;
        }

        .border,
        .border th,
        .border td {
            padding: .25rem;
            border: 1px solid #000;
        }
    </style>
</head>

<body>
    {{-- logo start --}}
    <div style="text-align:center;padding:1mm 0mm">
        <img height="auto" width="300mm" src="#" />
    </div>
    <hr>
    {{-- logo end --}}

    <table style="width: 123mm;padding:0mm 1.5mm;border-bottom:solid 1px">
        <tr>
            <td><b>Name :</b> {{ $sale->student->name }}</td>
            <td><b>Class : </b> {{ $sale->student->classes->name }}</td>
            <td style="text-align:right;"><b>Date :</b> {{ \Carbon\Carbon::parse($sale->date)->format('Y-m-d') }}</td>
        </tr>
        <tr>
            <td colspan="2" style="text-align:left;"><b>Adm. No. : </b> {{ $sale->student->enrolment_no }}</td>
            <td style="text-align:right;"><b>Recept No. : </b> {{ $sale->id }} </td>
        </tr>
    </table>

    <table class="border" style="width: 100%;">

        <tr style="background-color:#3d3c3c;color:#fff;border:solid 1px #000">
            <th style="width:5mm">SR</th>
            <th style="width:60mm">Items</th>
            <th style="width:5mm">Qnt</th>
            <th style="width:5mm">Unit</th>
            <th style="width:15mm">MRP({{ $symbol }})</th>
            <th style="width:15mm">Total({{ $symbol }})</th>
        </tr>

        @foreach ($sale->saleItems as $key => $item)
            <tr>
                <td>{{ $key }}</td>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ $item->product->unit->short_name }}</td>
                <td>{{ $item->mrp }}</td>
                <td>{{ $item->quantity * $item->mrp }}</td>
            </tr>
        @endforeach


        <tr>
            <td colspan="6"></td>
        </tr>
        @if ($sale->other_amount > 0)
            <tr>
                <td colspan="5" style="text-align:right; font-size: .6rem;"><b>Other Charges
                        ({{ $symbol }})</b></td>
                <td colspan="1" style=" font-size: .6rem;"><b>{{ $sale->other_amount }}</b></td>
            </tr>
        @endif

        <tr>
            <td colspan="5" style="text-align:right; font-size: .6rem;"><b>Total ({{ $symbol }})</b>
            </td>
            <td colspan="1" style=" font-size: .6rem;">
                <b>{{ $sale->total_amount + $sale->discount + $sale->other_amount }}</b>
            </td>
        </tr>


        @if ($sale->discount > 0)
            <tr>
                <td colspan="5" style="text-align:right; font-size: .6rem;"><b>Discount ({{ $symbol }})</b>
                </td>
                <td colspan="1" style=" font-size: .6rem;"><b>{{ $sale->discount }}</b></td>
            </tr>
        @endif

        <tr>
            <td colspan="5" style="text-align:right; font-size: .6rem;"><b>Grand Total ({{ $symbol }})</b>
            </td>
            <td colspan="1" style=" font-size: .6rem;"><b>{{ $sale->total_amount }}</b></td>
        </tr>

        <tr>
            <td colspan="5" style="text-align:right; font-size: .6rem;"><b>Paid Amount ({{ $symbol }})</b>
            </td>
            <td colspan="1" style=" font-size: .6rem;"><b>{{ $sale->paid_amount }}</b></td>
        </tr>
        @if ((int) $sale->total_amount - (int) $sale->paid_amount > 0)
            <tr>
                <td colspan="6" style="font-size: .6rem;"><b>Due Amount ({{ $symbol }}) :
                        {{ (int) $sale->total_amount - (int) $sale->paid_amount }}</b></td>
            </tr>
        @endif

    </table>

    <div>
        <table style="width: 100%;">
            <tr>
                <td style="text-align:right;padding: 0px .25rem">
                    <span>signature__________________</span>
                </td>
            </tr>
        </table>
        <table class="border" style="width: 100%;">
            <tr>
                <td>
                    <small style="padding:0.5mm">
                        <b>Note :</b> {{ $sale->notes }}
                    </small>

                </td>
            </tr>
        </table>
    </div>

</body>

</html>
