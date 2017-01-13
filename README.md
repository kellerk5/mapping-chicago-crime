#Chicago Crime Map

###Starting the Application
```
- git clone {myGitRepo}
- cd chicago-crime-map
- npm install
- npm start
- Check 'localhost:8080' 
```

###Future Improvements
- Create more visualization options.
- Defer loading of large Fetch requests.
- See what can be done about Google Maps performance under excessive polygon/circle drawing.
- Testing with Chai/Mocha.

###Known Issues 
- Delay (Chrome) after selecting the max request limit.
- Select tag missing dropdown arrows on mobile.

###Challenges / Admitted Flaws
1. Webpack. It was right for the job but wrestling with the endless configuration options can be tough. Normally I would make a global stylesheet with importable mixins and variables but 'bootstrap-sass' was a particular pain to set up. Please accept my occasional 'import' statement within stylesheets.
2. Redux. At the inception of this project, I knew that I wanted to utilize Redux. However, I drafted up my design and started coding without making that a priority from the start. By the time I finished developing the core functionality, I did not have enough time to implement Redux into my existing project. I felt that, given my time frame, it would have involved too much deconstruction for a tool with minimal benefit in a tiny application. 
3. Chai/Mocha. I did not have time to implement testing tools. I left the testing boilerplate files as I would still like to explore this on my own time.

###Misc. Notes
- Only tested on iOS (iPhone 5 & 6) and Safari/Chrome/Firefox (sorry, IE).
- After selecting 'HEATMAP' as a mapping option, zoom in on the map to get a more accurate look at the crime density.
- Mapping more than 5,000 data points may take a bit.
- Though it makes scrolling to the dropdowns more difficult, I allowed Google Maps to have the single touch drag event (mobile). I think that it makes the map easier to navigate in comparison to the double-tap zoom.