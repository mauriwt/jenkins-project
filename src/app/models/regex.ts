export class ExpRegular {
    public static decimal = "^[0-9]+(\.[0-9]{1,2})?$";
    public static entero = "^[0-9]*$";
    public static numerominmax = "^[0-9]{9,10}$";
    public static pArterial = "^([0-9]{1,3})\/([0-9]{1,3})?$";
    public static letras = "^[a-zA-ZÑñáéíóúÁÉÍÓÚ ]*$";
    public static letrasMay = "^[A-ZÑÁÉÍÓÚ ]*$";
    public static letrasMaySinEspacio = "^[A-Z \.]+$";
    public static alfNumerico = "^[0-9a-zA-ZÑñáéíóúÁÉÍÓÚ ]*$";
    public static alfNumericoMay = "^[0-9A-Z]*$";
    public static email = "^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$";
    public static ruta = /^[a-zA-Z]:\\(\w+\\)*\w*$/i;
    public static customMayus = new RegExp('^[a-zA-ZÑñáéíóúÁÉÍÓÚ ]*$');
    public static especiales = "/^[a-z0-9]+$/i";
    public static telfCelular = "^(0[1-9]{1})([0-9]{8})$";
    public static nombresCanalDigital = "^(([a-zA-ZÑñáéíóúÁÉÍÓÚ]+ )*[a-zA-ZÑñáéíóúÁÉÍÓÚ]+)?$";
    public static urlValidar = /(((http|ftp|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/;


    //mensajes
    public static mdecimal = "El campo solo permite números enteros y decimales.";
    public static mentero = "El campo solo permite números enteros.";
    public static mletras = "El campo solo permite letras.";
    public static mletrasCanal = "El campo solo permite letras, espacio, letras.";
    public static mtelf = "El teléfono debe tener entre 9 y 10 dígitos sin carácteres especiales.";
    public static m_email = "El correo electrónico ingresado no es válido";

    constructor() {}
}
