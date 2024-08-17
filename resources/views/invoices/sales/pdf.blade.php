<!DOCTYPE html>
<html lang="en">

<head>

    <title>Recept No. - {{ $sale->id }} | Sale Invoice </title>
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
                        <b>Recept No. : </b> {{ $sale->id }} | {{ $sale->invoice_id }} <br />
                    </td>
                    <td style="text-align:right;">
                        <b>Date :</b> {{ \Carbon\Carbon::parse($sale->date)->format('Y-m-d') }}
                    </td>
                </tr>
            </table>

            <table style="width: 100%; border-top: solid 1px; margin-top: 1mm;">
                <tr style="border-bottom: solid 1px;">
                    <td style="width: 50%; text-align: left;">
                        <div>
                            <h3 style="margin: 2px 0;">Billed From:</h3>
                            <h3 style="margin: 2px 0;">{{ $company->name }}</h3>
                            <p style="margin: 2px 0; font-size: 10px;">{{ $company->address }},{{ $company->city }}
                            </p>
                            <p style="margin: 2px 0; font-size: 10px;">{{ $company->state }}, {{ $company->country }}
                                ({{ $company->postal_code }})</p>
                            <p style="margin: 2px 0; font-size: 10px;">{{ $company->phone }}, {{ $company->email }}
                            </p>

                        </div>
                    </td>
                    <td style="width: 50%; text-align: right;">
                        <div>
                            <h3 style="margin: 2px 0;">Billed To:</h3>
                            <h3 style="margin: 2px 0;">{{ $sale->customer->name }}</h3>
                            <p style="margin: 2px 0; font-size: 10px;">
                                {{ $sale->customer->address }},{{ $sale->customer->city }}</p>
                            <p style="margin: 2px 0; font-size: 10px;">{{ $sale->customer->state }},
                                {{ $sale->customer->country }} ({{ $sale->customer->postal_code }})</p>
                            <p style="margin: 2px 0; font-size: 10px;">{{ $sale->customer->phone }},
                                {{ $sale->customer->email }}</p>
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
                <th style="text-align:center">Rate ({{ $system->currency->short_name }})</th>
                <th style="text-align:center">Qnt</th>
                <th style="text-align:center">Unit</th>
                <th style="text-align:center">Total ({{ $system->currency->short_name }})</th>
            </tr>

            @php
                $space = 160;
            @endphp
            @foreach ($sale->sale_items as $key => $item)
                <tr>
                    <td style="text-align:center">{{ $key + 1 }}</td>
                    <td style="text-align:center">{{ $item->product_name }}</td>
                    <td style="text-align:center">{{ $item->product_code }}</td>
                    <td style="text-align:center">{{ round($item->final_price, 2) }}</td>
                    <td style="text-align:center">{{ $item->quantity }}</td>
                    <td style="text-align:center">{{ $item->sale_unit->short_name }}</td>
                    <td style="text-align:center">{{ $item->subtotal }}</td>
                </tr>
                @php
                    $space = $space - 5;
                @endphp
            @endforeach


            <tr>
                <td>
                    <div style="min-height: {{ $space }}mm"></div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td colspan="6" style="text-align:right;"><b>Total
                        ({{ $system->currency->short_name }})</b>
                </td>
                <td colspan="1">
                    <b>{{ round($sale->total_cost, 2) }}</b>
                </td>
            </tr>

            <tr>
                <td colspan="6">
                    <table style="width: 100%;">
                        <tr>
                            <th style="border:0;text-align:center">Shipping Cost ({{ $system->currency->short_name }})
                            </th>
                            <th style="border:0;text-align:center">Other Cost ({{ $system->currency->short_name }})
                            </th>
                            <th style="border:0;text-align:center">Discount ({{ $system->currency->short_name }})</th>
                            <th style="border:0;text-align:center">Tax (%)</th>
                        </tr>
                        <tr>
                            <td style="border:0;text-align:center">{{ $sale->shipping_cost }}</td>
                            <td style="border:0;text-align:center">{{ $sale->other_cost }}</td>
                            <td style="border:0;text-align:center">
                                {{ round($sale->discount_method == '0' ? $sale->discount : $sale->total_cost * ($item->discount / 100), 2) }}
                            </td>

                            <td style="border:0;text-align:center">{{ round($sale->total_tax) }}
                                ({{ $sale->tax_rate }} %)</td>
                        </tr>
                    </table>
                </td>
                <td colspan="1"></td>
            </tr>


            <tr>
                <td colspan="6" style="text-align:right;"><b>Grand Total
                        ({{ $system->currency->short_name }})</b>
                </td>
                <td colspan="1"> <b>{{ round($sale->grand_total, 2) }}</b></td>
            </tr>

            <tr>
                <td colspan="6" style="text-align:right;"><b>Paid Amount
                        ({{ $system->currency->short_name }})</b>
                </td>
                <td colspan="1"><b>{{ round($sale->paid_amount, 2) }}</b></td>
            </tr>

        </table>
    </main>





    <footer>
        <div class="footer">
            <table style="width: 100%; margin-top:10mm">
                <tr>
                    <td style="text-align:left;padding: 0px .25rem">
                        <span>Receiver's signature</span>
                    </td>
                    <td style="text-align:right;padding: 0px .25rem">
                        <span>Authorised signature</span>
                    </td>
                </tr>
            </table>
            <table class="border" style="width: 100%; margin-top:5mm">
                <tr>
                    <td>
                        <small style="padding:0.5mm">
                            <b>Note :</b> {{ $sale->note }}
                        </small>

                    </td>
                </tr>
            </table>
        </div>
    </footer>



</body>

</html>
