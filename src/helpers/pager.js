export class Pager{
    items = [];
    resultsPerPage;
    pagedItems = [];
    selectedPage = 0

    constructor(options){
        let {items,resultPerPage} = options;
        this.items = [...items];
        this.resultsPerPage = resultPerPage;
        try{
            if(this.items){
                this.initPages(this.items,this.resultsPerPage);
            }
        }
        catch(e){
            console.error('error init pager: ',e);
        }
    }

    initPages(items,resultsPerPage){
        this.pagedItems = this.buildEmptyArrays(items,resultsPerPage);
        let currentItemIndex = 0;
        let numAdded = 0;
        for(let i = 0;i < this.pagedItems.length;i++){
            while(numAdded < resultsPerPage){
                if(currentItemIndex === items.length){
                    break;
                }
                this.pagedItems[i].push(items[currentItemIndex]);
                currentItemIndex++;
                numAdded++;
            }

            numAdded = 0;
        }

        console.log(this.pagedItems,this.resultsPerPage);
    }

    changePage(page){
        this.selectedPage = page;
    }

    buildEmptyArrays(items,resultsPerPage){
        let pages = Math.ceil(items.length / resultsPerPage);
        let pagedItems = [];
        for(let i = 0;i < pages;i++){
            pagedItems.push([]);
        }

        return pagedItems;
    }

    getPage(page){
        if(page || page === 0){
            return this.pagedItems[page];
        }
        return this.pagedItems[this.selectedPage];
    }
}