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

        <h1>Invoice</h1>
        <div class="row">
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Client Name</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Amount Due</th>
                            <th>Aamount_paid</th>
                            <th>Bill From</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{$invoice->number}}</td>
                            <td>{{$invoice->bill_to["name"] ?? '-'}}</td>
                            <td>{{\Carbon\Carbon::parse($invoice->date)->format('F j, Y') }}</td>
                            <td>{{\Carbon\Carbon::parse($invoice->due_date)->format('F j, Y') }}</td>
                            <td>{{$invoice->amount_due}}</td>
                            <td>{{$invoice->amount_paid}}</td>
                            <td>{{$invoice->bill_from}}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <h1>Invoice Lines</h1>
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
                        @foreach($invoice->lines as $key=> $line)
                        <tr>
                            <td>{{ $invoice->lines[$key]["item"] }}</td>
                            <td>{{ $invoice->lines[$key]["quantity"] }}</td>
                            <td>{{ $invoice->lines[$key]["rate"] }}</td>
                            <td>{{ $invoice->lines[$key]["amount"] }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>

                <div>
                    <p><b>Notes:</b> {{$invoice->notes ?? '-'}}</p>
                </div>

            </div>
        </div>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>

</html>