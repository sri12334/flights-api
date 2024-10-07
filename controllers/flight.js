import Flight from '../models/flight.js'

const flightControllers = {
    getAllFlights: (req, res) => {
        const flights = Flight.getAll();
        const { token } = req.cookies; 
        res.status(200).render('flights', {
           flights,
           token
        });
    },
    getFlightById: (req, res) => {
        const {id} = req.params;
        const flight = Flight.getById(id);
        if (!flight) {
            res.status(400).render('404', {
                title: 'flight not found',
                message: 'flight not found'
            })
        } else {
            res.status(200).render('flight',{flight});
        }
    },
    getAddFlightForm: (req, res) => {
        res.status(200).render('add-Flight-form');
    },
    addFlight: (req, res) => {
        const {from, to, date, price, company} = req.body;
        if (!from || !to|| !date || !price || !company) {
            return res.status(400).render('404', {
                title: 'Invalid input',
                message : 'Invalid input'
            })
        } else {
            Flight.add({from, to, date, price, company});
            res.status(302).redirect('/api/flights')
        }
    },
    updateFlight: (req, res) => {
        const {id} = req.params;
        const {from, to, date, price, company} = req.body;
        const flight = Flight.getById(id)
        if (from && to && date && price && company) {
            Flight.update(id, {from, to, date, price, company})
            res.status(200).json(flight);
        } else {
            res.status(404).json({
                title: 'Flight not found',
                message: 'Flight not found'
            });
        }
    },
    deleteFlight: (req, res) => {
        const {id} = req.params ;
        const flight = Flight.getById(id);
        if (flight) {
            Flight.delete(id);
            res.status(200).json(flight);
        } else {
            res.status(404).json({
                title: 'Flight not found',
                message: 'Flight not found'
            });
        }
        
    }

}

export default flightControllers;

