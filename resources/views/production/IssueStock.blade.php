<!DOCTYPE html>
<html lang="en">

<head>

    <title>Stock Issue - {{ $stockIssue->id }} | Stock Issue </title>
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
                        <b>Stock Issue No. : </b> {{ $stockIssue->id }} | {{ $stockIssue->code }} <br />
                    </td>
                    <td style="text-align:right;">
                        <b>Date :</b> {{ \Carbon\Carbon::parse($stockIssue->date)->format('Y-m-d') }}
                    </td>
                </tr>
            </table>


            <table style="width: 100%;margin-top:1mm">
                <tr>
                    <td style="width: 50%">
                        <table style="width: 100%">
                            <tr>
                                <td>
                                    <b>Production Order : </b>
                                </td>
                                <td>
                                    {{ $stockIssue->productionOrder->code }}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <b>Bill Of Material : </b>
                                </td>
                                <td>
                                    {{ $stockIssue->productionOrder->billOfMaterial->code }}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <b>Order Date : </b>
                                </td>
                                <td>
                                    {{ \Carbon\Carbon::parse($stockIssue->productionOrder->date)->format('Y-m-d') }}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <b>Order Quantiy : </b>
                                </td>
                                <td>
                                    {{ $stockIssue->productionOrder->quantity }}
                                    {{ $stockIssue->productionOrder->billOfMaterial->product->unit->short_name }}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <b>Start Date : </b>
                                </td>
                                <td>
                                    {{ \Carbon\Carbon::parse($stockIssue->productionOrder->start_at)->format('Y-m-d') }}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <b>End Date : </b>
                                </td>
                                <td>
                                    {{ \Carbon\Carbon::parse($stockIssue->productionOrder->end_at)->format('Y-m-d') }}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <b>Status : </b>
                                </td>
                                <td>
                                    {{ $stockIssue->status }}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="text-align:right;width: 50%">

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
                <th style="text-align:center">Batchs</th>
                <th style="text-align:center">PR</th>
            </tr>
            @foreach ($stockIssue->stockIssueItems as $key => $item)
                <tr>
                    <td style="text-align:center">{{ $key + 1 }}</td>
                    <td style="text-align:center">{{ $item->productWarehouse->product->name }}</td>
                    <td style="text-align:center">{{ $item->productWarehouse->product->code }}</td>
                    <td style="text-align:center">{{ $item->quantity }}</td>
                    <td style="text-align:center">{{ $item->unit->short_name }}</td>
                    <td style="text-align:center">
                        @foreach ($item->stockIssueItemBatches as $batch)
                            {{ $batch->productBatch->batch }} ({{ $batch->quantity }} {{ $item->unit->short_name }}),
                        @endforeach
                    </td>
                    <td>
                        @php
                            $avalQnt =
                                $item->unit->operator === '*'
                                    ? $item->productWarehouse->quantity
                                    : $item->productWarehouse->quantity * $item->unit->operator_value;
                            $requiredQnt = $avalQnt - $item->quantity > 0 ? 0 : $item->quantity - $avalQnt;
                        @endphp
                        {{ $requiredQnt }} {{ $item->unit->short_name }}
                    </td>
                </tr>
            @endforeach

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
        </div>
    </footer>
</body>

</html>
