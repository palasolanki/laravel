<!doctype html>
<html lang="en">

	<head>
		<!-- Required meta tags -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

		<!-- Bootstrap CSS -->
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
			integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

		<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap" rel="stylesheet">

		<title>Invoice</title>

	</head>
	<style>
		body {
			font-family: 'Open Sans', sans-serif;
		}

		.logo {
			width: 130px;
		}

		.heading-table td {
			border-top: 0px transparent;
		}

		.company_details {
			font-size: 11.5px;
			color: gray;
		}

		.invoice__list {
			padding-left: 0;
			list-style-type: none;
		}

		.invoice__list li span:last-child {
			padding-left: 50px;
		}

		.width-100 {
			width: 100px;
		}

		.invoice_details p,
		.table td {
			font-size: 14px;
		}

		.width-300 {
			width: 250px;
		}

		.invoice-detail-table td {
			padding: 0;
		}
	</style>

	<body>
		<div class="container-fluid">
			<table class="table heading-table">
				<tbody>
					<tr>
						<td class="logo pr-0"><img src={{asset("images/logo.jpeg")}} alt="" class="image" height="110"
								width="110"></td>
						<td class="pl-0">
							<p class="mb-0" style="font-size: 1.5em;">Radicalloop Technolabs LLP</p>
							<div class="company_details mt-1">C-510, Titanium City Center,
								100 Ft. Anand Nagar Road,<br />
								Ahmedabad - 380015,
								Gujarat, India<br>
								GSTIN: 24AAUFR2815E1Z6<br>
								www.radicalloop.com | hello@radicalloop.com</div>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="banner mx-2 ">
				<p class="text-success mb-0" style="font-size:2em">INVOICE</p>
			</div>

			<table class="table heading-table">
				<tbody class="mx-5">
					<tr>
						<td>
							<table class="table heading-table invoice-detail-table">
								<tbody>
									<tr>
										<td class="width-100 ">Invoice #:</td>
										<td>{{$invoice->number}}</td>

									</tr>
									<tr>
										<td class="width-100">Issue Date:</td>
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
						<td>
							<p class="float-right"><span class="text-success">Bill to:</span><br />
								<strong>{{$invoice->bill_to["name"]}}</strong> <br />
								{{$invoice->bill_to["address"]}}<br />
								{{$invoice->bill_to["email"]}}
							</p>

						</td>
					</tr>
				</tbody>
			</table>




			<table class="table">
				<thead>
					<tr>
						<th scope="col">Item</th>
						<th scope="col">Qty./Hrs.</th>
						<th scope="col">Unit Price</th>
						<th scope="col" class="text-end">Amount</th>
					</tr>
				</thead>
				<tbody>
					@foreach($invoice->lines as $line)
					<tr>
						<td scope="row">{{ $line["item"] }}</td>
						<td>{{ $line["quantity"] }}</td>
						<td>{{ $line["rate"] }}</td>
						<td class="text-end">{{ $line["amount"] }}</td>
					</tr>
					@endforeach


				</tbody>
			</table>

			<table class="table heading-table">
				<tbody class="mx-5">
					<tr>
						<td>
							<table class="table heading-table invoice-detail-table">
								<tbody>
									<tr>
										<td class="width-100 "></td>
										<td></td>

									</tr>
									<tr>
										<td class="width-100"></td>
										<td></td>

									</tr>
									<tr>
										<td class="width-100"></td>
										<td></td>
									</tr>
									<tr>
										<td class="width-100"></td>
										<td></td>
									</tr>
								</tbody>
							</table>

						</td>
						<td class="width-300">
							<table class="table heading-table table-bottom float-right invoice-detail-table">
								<tbody>
									<tr class="border-bottom">
										<td>Subtotal: </td>
										<td>{{$currency_sign}} {{$total}}</td>

									</tr>
									<tr>
										<td class="text-success"><strong>Total:</strong> </td>
										<td><strong>{{$currency_sign}} {{$total}}</strong></td>

									</tr>
									<tr>
										<td>Paid: </td>
										<td>{{$currency_sign}} {{$invoice->amount_paid}}</td>
									</tr>
									<tr>
										<td class="text-success"><strong>Amount Due: </strong></td>
										<td><strong>{{$currency_sign}} {{$invoice->amount_due}}</strong></td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>


			<table class="table table-borderless fs-3" style="margin-top: 100px;">
				<tbody>
					<tr>
						<td><strong>{{$invoice->bill_to["name"]}}</strong>, thank you very much. We really appreciate
							your business.<br>
							Please send payments before the due date.</td>
					</tr>


				</tbody>
			</table>
			<table class="table table-borderless">
				<tbody>
					<tr>
						<td><strong class="text-success">Payment details:</strong><br />
							Account No: 123006705<br />
							IBAN: US100000060345 <br />
							SWIFT: BOA447</td>
					</tr>

				</tbody>
			</table>

		</div>
	</body>

</html>