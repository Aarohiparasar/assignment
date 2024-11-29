The project is a Node.js application with a MongoDB database backend and includes features such as dynamic data generation, RESTful endpoints, and efficient pagination techniques.
The implementation prioritizes performance, consistency, and scalability while maintaining simplicity in setup and usage.
**Key Features:-
1.Cursor-Based Pagination:
     A performant data fetching strategy that eliminates issues like data skipping or duplication during high-volume transactions.
     Instead of using traditional page numbers, a cursor (timestamp or unique ID) is used to fetch the next set of results efficiently.
2.Seed Script:
    Generates 10,000 sample order records for testing and demonstration purposes.
    Simulates realistic data with attributes like customer names, order amounts, statuses, items, and timestamps.
3.RESTful API Endpoints:
   Simple and intuitive routes for retrieving paginated data.
   Flexible parameters for customizing result limits and navigating datasets.
4.Performance Optimization:
    Indexed queries for faster database lookups.
    Limited result sizes to reduce memory usage and improve response times.

Deployed LINK-https://magical-faun-91126d.netlify.app/
