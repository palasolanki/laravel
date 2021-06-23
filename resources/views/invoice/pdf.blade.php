<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <title>Invoice</title>
</head>

<body>
    <div class="container">

        <h1>Invoice #{{$invoice->number}}</h1>
        <div class="row">
            <div class="col-md-12">
                <div style="white-space: pre-line; margin-bottom: 20px;">
                    {{$invoice->bill_from}}
                </div>
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td>Client Name</td>
                            <td>{{$invoice->bill_to["name"] ?? '-'}}</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>{{\Carbon\Carbon::parse($invoice->date)->format('F j, Y') }}</td>
                        </tr>
                        <tr>
                            <td>Due Date</td>
                            <td>{{\Carbon\Carbon::parse($invoice->due_date)->format('F j, Y') }}</td>
                        </tr>
                        <tr>
                            <td>Amount Due</td>
                            <td>{{$invoice->amount_due}}</td>
                        </tr>
                        <tr>
                            <td>Amount Paid</td>
                            <td>{{$invoice->amount_paid}}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <table class="table table-bordered mb-2">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($invoice->lines as $line)
                        <tr>
                            <td>{{ $line["item"] }}</td>
                            <td>{{ $line["quantity"] }}</td>
                            <td>{{ $line["rate"] }}</td>
                            <td>{{ $line["amount"] }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>

                <div style="margin-top:20px;">
                    <p><b>Notes:</b> {{$invoice->notes ?? '-'}}</p>
                </div>

            </div>
        </div>
    </div>

</body>

</html>