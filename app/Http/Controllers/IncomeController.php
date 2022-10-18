<?php

namespace App\Http\Controllers;

use App\Client;
use App\Http\Requests\IncomeRequest;
use App\Income;
use App\Invoice;
use Pimlie\DataTables\MongodbDataTable;
use App\Tag;
use Symfony\Component\HttpFoundation\Request;
use App\Traits\ChartData;
use Carbon\Carbon;
use Yajra\DataTables\DataTables;

class IncomeController extends Controller
{
    use ChartData;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $from = ($request->daterange[0]) ? Carbon::parse($request->daterange[0]) : null;
        $to = ($request->daterange[1]) ? Carbon::parse($request->daterange[1]) : null;

        $selectedClient = $request->client;
        $selectedMediums = $request->mediums;
        $selectedTags = $request->tags;
        $income = Income::with('tags')
            ->when($from, function ($income) use ($from, $to) {
                return $income->whereBetween('date', [$from, $to]);
            })
            ->when($selectedClient != "all", function ($income) use ($selectedClient) {
                return $income->where('client.id', $selectedClient);
            })
            ->when($selectedMediums, function ($income) use ($selectedMediums) {
                return $income->whereIn('medium.id', $selectedMediums);
            })
            ->when($selectedTags, function ($income) use ($selectedTags) {
                return $income->whereIn('tag_ids', $selectedTags);
            });

        $totalAmount = $income->sum("amount");

        return (new MongodbDataTable($income))
            ->addColumn('selectedDateForEdit', function ($income) {
                return $income->date;
            })
            ->with('totalAmount', $totalAmount)
            ->make(true);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(IncomeRequest $request)
    {
        $request->save();
        return ['message' => 'Income added successfully.'];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function show(Income $income)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function edit(Income $income)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function update(IncomeRequest $request, Income $income)
    {
        $request->save($income);
        return ['updateIncome' => $income, 'message' => 'Income updated successfully.'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function destroy(Income $income)
    {
        $income->delete();
        return ['message' => 'Income deleted successfully.'];
    }

    public function monthlyIncomeChart(Request $request)
    {
        $chartData = $this->getChartData($request->chart_range, 'income');
        return ['monthlyIncome' => $chartData[0], 'labels' => $chartData[1]];
    }

    public function getTagList()
    {
        $tags = Tag::select('_id', 'tag')->where('type', 'income')->get();
        return ['tags' => $tags];
    }

    public function addAsIncome(Invoice $invoice){
        
        if($invoice->status !== 'paid' || Income::where('invoice_id', $invoice->_id)->exists()) {
            return response()->json(['message' => 'Income already exist or Invoice status is not paid'], 500);
        }

        $client = Client::with('medium')->findOrFail($invoice->client_id);

        $incomeLineData = [
            'client' => ['id' => $client->_id, 'name' => $client->name],
            'date' => Carbon::parse($invoice->payment_receive_date),
            'amount' => $invoice->inr_amount_received,
            'medium' => ['id' => $client->medium->_id, 'medium' => $client->medium->medium],
            'notes' => 'Payment for Invoice #' . $invoice->number,
            'invoice_id' => $invoice->_id
        ];

        try {
            Income::create($incomeLineData);
        }
        catch(\Exception $e)
        {
            return response()->json(['message' => 'Something went wrong! Unable to add as Income'], 500);
        }
        return response()->json(['message' => 'Invoice added as income successfully'], 200);
    }
}
