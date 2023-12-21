export class StorageManager{
    constructor(){
        this._save_name = document.title;
    }

    setItem(name, value){
        localStorage.setItem(this._save_name + "_" + name, value);
    }

    getItem(name, value){
        if(value == undefined) value = null;
        let result = localStorage.getItem(this._save_name + "_" + name);
        if(result != null){
            return result;
        }
        return value;
    }

    deleteItem(name){
        localStorage.removeItem(this._save_name + "_" + name);
    }

    clear(){
        localStorage.clear();
    }
}