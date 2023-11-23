const App = () => {
    const store = Redux.createStore(Redux.combineReducers(reducers));
    return (
        <ReactRedux.Provider store={store}>
            <Main></Main>
        </ReactRedux.Provider>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));