<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:display=swap" rel="stylesheet">

    <title>Invoice</title>

</head>
<style>
    body {
        font-family: 'Open Sans', sans-serif;
    }

    .currency_sign {
        font-family: 'DejaVu Sans', sans-serif;
    }

    .company_details {
        font-size: 12.5px;
        color: rgb(73, 73, 73);
    }

    .company_details_closure {
        font-size: 12px;
    }

    .width-100 {
        width: 100px;
    }

    .invoice_details p,
    .table td,
    .table th {
        font-size: 14px;
    }

    .width-230 {
        width: 230px;
    }
    
    .width-270 {
        width: 270px;
    }

    .width-450 {
        width: 450px;
    }

    .table-td-p-0 td {
        padding: 0;
    }

    hr {
        opacity: 0.5;
        margin: 8px 0px;
    }

    .font-16 {
        font-size: 16px;
    }

    .table-list th, .table-list td{
        padding: 7px 12px;
    }

    .total-table{
        margin-right: 10px;
    }

</style>

<body>

    @php
        $currency_class = ($invoice->currency === 'INR') ? 'currency_sign' : '';
    @endphp

    <div class="container-fluid">

        <table class="table table-borderless">
            <tbody class="mx-5">
                <tr>
                    <td class="pb-0">
                        <table class="table table-borderless mb-0">
                            <tbody>
                                <tr>
                                    <td class="logo p-0"><img src={{asset("images/striplogo.png")}} alt="" class="image"
                                            width="200"></td>
                                </tr>
                                <tr>
                                    <td class="p-0">
                                        <p class="mb-0" style="font-size: 1.4em;">Radicalloop Technolabs LLP</p>
                                        <div class="company_details mt-1">601/A, Parshwanath Esquare, Corporate Road,
                            Prahladnagar,<br />
                                            Ahmedabad - 380015,
                                            Gujarat, India.<br>
                                            GSTIN: 24AAUFR2815E1Z6<br>
                                            <span class="company_details_closure">www.radicalloop.com |
                                                hello@radicalloop.com</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </td>
                    <td>
                        <table class="table table-borderless">
                            <tbody class="text-right">
                                <tr>
                                    <td class="p-0">
                                        <p class="text-success mb-0" style="font-size:2.5em; letter-spacing:2px">
                                            INVOICE</p>
                                    </td>
                                </tr>
                                <tr class="text-right">
                                    <td class="p-0" style="font-size: 1.2rem;">
                                        # {{$invoice->number}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </td>
                </tr>
            </tbody>
        </table>
        <hr />



        <div class="banner mx-2 ">
        </div>

        <table class="table table-borderless m-0">
            <tbody class="mx-5">
                <tr>
                    <td class="py-0 pt-2">
                        <p><span class="text-success">Bill to:</span><br />
                            <strong>{{$invoice->bill_to["name"]}}</strong> <br />
                            @if($invoice->bill_to["company_name"])
                                {{$invoice->bill_to["company_name"]}}<br />
                            @endif
                            @if($invoice->bill_to["address"])
                            {!! nl2br($invoice->bill_to["address"]) !!}<br />
                            @endif

                            {{$invoice->bill_to["email"]}}
                        </p>

                    </td>
                    <td class="width-230 py-0 pt-2">
                        <table class="table table-borderless table-td-p-0 float-right">
                            <tbody class="float-right">

                                <tr>
                                    <td class="width-100">Date:</td>
                                    <td>{{\Carbon\Carbon::parse($invoice->date)->format('F j, Y') }}</td>

                                </tr>
                                <tr>
                                    <td class="width-100">Due Date:</td>
                                    <td>{{\Carbon\Carbon::parse($invoice->due_date)->format('F j, Y') }}</td>
                                </tr>
                                <tr>
                                    <td class="width-100">Currency:</td>
                                    <td>{{$invoice->currency}}</td>
                                </tr>
                            </tbody>
                        </table>

                    </td>
                </tr>
            </tbody>
        </table>

        <table class="table table-list">
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col" class="text-right text-nowrap">SAC Code</th>
                    <th scope="col" class="text-right text-nowrap">Qty. / Hrs.</th>
                    <th scope="col" class="text-right text-nowrap">Unit Price</th>
                    <th scope="col" class="text-right text-nowrap pr-5">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->lines as $line)
                <tr>
                    <td class="{{$currency_class}}">{{ $line["item"] }}</td>
                    <td class="text-right text-nowrap {{$currency_class}}">{{ $gstConfigs['SAC_code'] }}</td>
                    <td class="text-right text-nowrap {{$currency_class}}">{{ number_format($line["quantity"],2) }}</td>
                    <td class="text-right text-nowrap {{$currency_class}}">{{$currencyConfigs[$invoice->currency]}}{{ $line["hourly_rate"] }}</td>
                    <td class="text-right text-nowrap pr-5 {{$currency_class}}">{{$currencyConfigs[$invoice->currency]}}{{ number_format($line["amount"],2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <table class="table table-borderless float-right table-td-p-0 width-270 total-table">
            <tbody>
                <tr>
                    <td class="{{$currency_class}}">Subtotal</td>
                    <td class="text-right {{$currency_class}}">{{$currencyConfigs[$invoice->currency]}}{{number_format($invoice->sub_total,2)}}</td>

                </tr>
                @if($invoice->gst_option === 'same_state')
                    <tr>
                        <td class="{{$currency_class}}">SGST @ {{$gstConfigs['SGST']}}%</td>
                        <td class="text-right {{$currency_class}}">{{$currencyConfigs[$invoice->currency]}}{{number_format(($gstConfigs['SGST']*$invoice->sub_total)/100,2)}}</td>

                    </tr>
                    <tr>
                        <td class="{{$currency_class}}">CGST @ {{$gstConfigs['CGST']}}%</td>
                        <td class="text-right {{$currency_class}}">{{$currencyConfigs[$invoice->currency]}}{{number_format(($gstConfigs['CGST']*$invoice->sub_total)/100,2)}}</td>

                    </tr>
                @elseif($invoice->gst_option === 'other_state')
                    <tr>
                        <td class="{{$currency_class}}">IGST @ {{$gstConfigs['IGST']}}%</td>
                        <td class="text-right {{$currency_class}}">{{$currencyConfigs[$invoice->currency]}}{{number_format(($gstConfigs['IGST']*$invoice->sub_total)/100,2)}}</td>

                    </tr>
                @endif
                <tr>
                    <td class="text-success align-middle {{$currency_class}}"><strong>Total </strong></td>
                    <td class="text-right {{$currency_class}}"><strong>{{$currencyConfigs[$invoice->currency]}}{{number_format($invoice->total,2)}}</strong></td>

                </tr>
                <tr>
                    <td class="{{$currency_class}}">Paid</td>
                    <td class="text-right {{$currency_class}}">{{$currencyConfigs[$invoice->currency]}}{{number_format($invoice->amount_paid,2)}}</td>
                </tr>
                <tr>
                    <td class="text-success align-middle {{$currency_class}}"><strong>Amount Due</strong></td>
                    <td class="text-right {{$currency_class}}"><strong>{{$currencyConfigs[$invoice->currency]}}{{number_format($invoice->amount_due,2)}}</strong></td>
                </tr>

            </tbody>
        </table>
        
        <hr style="margin-top:160px" />

        @if($invoice->notes)
        <table class="table table-borderless table-td-p-0 ml-2">
            <tbody>
                <tr>
                    <td colspan="2" class="text-success">Notes:</td>
                </tr>
                <tr>
                    <td>{{$invoice->notes}}</td>
                </tr>
            </tbody>
        </table>
        @endif

        <table class="table table-borderless table-td-p-0 ml-2 width-450">
            <tbody>
                <tr>
                    <td colspan="2" class="text-success">Payment details:</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-decoration: underline;">Beneficiary details:</td>
                </tr>
                <tr>
                    <td>Account Name:</td>
                    <td>Radicalloop Technolabs LLP</td>

                </tr>
                <tr>
                    <td>Bank Name:</td>
                    <td>Kotak Mahindra Bank</td>

                </tr>
                <tr>
                    <td>Bank Account Number:</td>
                    <td>9612495570</td>
                </tr>
                <tr>
                    <td>SWIFT Code:</td>
                    <td>KKBKINBB</td>
                </tr>
                <tr>
                    <td>Bank IFSC code:</td>
                    <td>KKBK0002587</td>
                </tr>

            </tbody>
        </table>

    </div>
</body>

</html>