<!DOCTYPE html>
<html lang="en">

<head>

    <title>BOM No. - {{ $billOfMaterial->id }} | Bill Of Material </title>
    <style>
        body {
            border: double 1px #000;
            height: 267mm;
            box-sizing: border-box;
            font-size: .6rem;
            font-family: "Lucida Console", "Courier New", monospace;
            position: relative;
            margin: 0;
            padding: 0;
        }

        .footer {
            position: absolute;
            bottom: 0;
            width: 100%;
        }

        .item_list {
            height: 180mm;
            overflow: auto;
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

    <header>

        <div>
            <div style="margin:2.5mm 0mm">
                <center>
                    <span style="font-size: 1.5rem;font-weight:bold">{{ $company->name }}</span><br />
                    <small style="font-size: 0.7rem;font-wait:bold; text-transform: uppercase">
                        {{ $company->address }},
                        {{ $company->city }}, {{ $company->state }}, {{ $company->country }}
                        ({{ $company->postal_code }})
                    </small>
                    <br />
                    <small style="font-size: 0.7rem;font-wait:bold;">{{ $company->phone }}, {{ $company->email }}</small>
                    <br>
                    <span> <b>GST : </b>09GKQPS5130F1ZP</span>
                </center>
            </div>

            <table style="width: 100%;border-bottom:solid 1px;border-top:solid 1px;margin-top:1mm">
                <tr>
                    <td>
                        <b>BOM No. : </b> {{ $billOfMaterial->id }} <br />
                    </td>
                    <td style="text-align:right;">
                        <b>Date :</b> {{ \Carbon\Carbon::parse($billOfMaterial->created_at)->format('Y-m-d') }}
                    </td>
                </tr>
            </table>

            <table style="width: 100%; border-top: solid 1px; margin-top: 1mm;">
                <tr style="border-bottom: solid 1px;">
                    <td style="width: 50%; text-align: left;">
                        <div>
                            <h3 style="margin: 2px 0;">Product Detail:</h3>
                            <h3 style="margin: 2px 0;">{{ $billOfMaterial->product }}
                                &nbsp;({{ $billOfMaterial->productCode }})</h3>
                            </p>

                        </div>
                    </td>
                </tr>
            </table>

        </div>

    </header>



    <main>
        <table class="border item_list" style="width: 100%">

            <tr style="background-color:#3d3c3c;color:#fff;border:solid 1px #000">
                <th style="text-align:center">SR</th>
                <th style="text-align:center">Items</th>
                <th style="text-align:center">Code</th>
                <th style="text-align:center">Qnt</th>
                <th style="text-align:center">Unit</th>
                <th style="text-align:center">Cost ({{ $system->currency->short_name }})</th>
            </tr>


            @foreach ($billOfMaterial->materials as $key => $item)
                <tr>

                    <td style="text-align:center">{{ $key + 1 }}</td>
                    <td style="text-align:center">{{ $item->name }}</td>
                    <td style="text-align:center">{{ $item->code }}</td>
                    <td style="text-align:center">{{ $item->quantity }}</td>
                    <td style="text-align:center">{{ $item->unit->short_name }}</td>
                    <td style="text-align:center">{{ $item->unit_cost }}</td>
                </tr>
            @endforeach



            <tr>
                <td colspan="5" style="text-align:right;"><b>Total
                        ({{ $system->currency->short_name }})</b>
                </td>
                <td colspan="1">
                    <b>{{ round($billOfMaterial->total, 2) }}</b>
                </td>
            </tr>

            <tr>
                <td colspan="5">
                    <table style="width: 100%;">
                        <tr>
                            <th style="border:0;text-align:center">Overhead Cost ({{ $system->currency->short_name }})
                            </th>
                            <th style="border:0;text-align:center">Other Cost ({{ $system->currency->short_name }})
                            </th>
                        </tr>
                        <tr>
                            <td style="border:0;text-align:center">{{ $billOfMaterial->overhead_cost }}</td>
                            <td style="border:0;text-align:center">{{ $billOfMaterial->other_cost }}</td>
                        </tr>
                    </table>
                </td>
                <td colspan="1"></td>
            </tr>


            <tr>
                <td colspan="5" style="text-align:right;"><b>Grand Total
                        ({{ $system->currency->short_name }})</b>
                </td>
                <td colspan="1"> <b>{{ round($billOfMaterial->overhead_cost + $billOfMaterial->other_cost + $billOfMaterial->total , 2) }}</b></td>
            </tr>

        </table>
    </main>

    <footer>
        <div class="footer">
            <table style="width: 100%; margin-top:5mm">
                <tr>
                    <td style="text-align:left;padding: 0px .25rem">
                        <span>Receiver's signature</span>
                    </td>
                    <td style="text-align:right;padding: 0px .25rem">
                        <span>Authorised signature</span>
                    </td>
                </tr>
            </table>
            {{-- <table class="border" style="width: 100%; margin-top:5mm">
                <tr>
                    <td>
                        <small style="padding:0.5mm">
                            <b>Note :</b> {{ $billOfMaterial->note }}
                        </small>

                    </td>
                </tr>
            </table> --}}
        </div>
    </footer>



</body>

</html>
