export const home = (path, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("slt");
    res.end();
}