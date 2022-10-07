function modelToPath(m){
    var path = m.replace(/[.\[\]]/g,'/').replace(/\/\//g,'/');
    if(path[path.length-1]=='/')path=path.substr(0,path.length-1);
    return path;
}
function pathToModel(p) {
    var x = p.replace(/\//g, '.');
    if (x[x.length - 1] == '.') x = x.substr(0, x.length - 1)
    return x;


}
