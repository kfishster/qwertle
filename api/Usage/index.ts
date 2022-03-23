import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // context.log('HTTP trigger function processed a request.');
    const started = (req.query.started || (req.body && req.body.started));
    const finished = (req.query.finished || (req.body && req.body.finished));
    const practice = (req.query.practice || (req.body && req.body.practice));
    const substrings = (req.query.substrings || (req.body && req.body.substrings));
    const heatmap = (req.query.heatmap || (req.body && req.body.heatmap));
    const hasWon = (req.query.hasWon || (req.body && req.body.hasWon));

    if (started != null) {
        context.log({
            'status': 'started',
            'practice': practice
        });        
    }

    else if (finished != null) {
        context.log({
            'status': 'finished',
            'practice': practice,
            'substrings': substrings,
            'heatMap': heatmap,
            'isWinner': hasWon
        });        
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
    };

};

export default httpTrigger;