<template>
    <div>
        <Modal v-model:modelValue="showModalNuevo">
            <GastoNewView @on-register="onRegister()" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <GastoEditView @on-update="onUpdate()" :item="itemToEdit" />
        </Modal>
        <h1>Lista de Gastos</h1>
        <div>{{path}}</div>
        <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
        <button @click="buscar()" class="btn btn-lith" style="float:right">Buscar</button>
        <input type="search" style="float:right" v-model="textToSearch" @search="buscar()">
        <div style="margin: 20px 0;">
            <h3>Filtros:</h3>
            <form @submit.prevent="filtrar()">

                <label for="fecha"> Fecha: </label>
                <input type="date" id="fecha" v-model="filter.fecha" placeholder="Ingrese la fecha" />

                <label for="item"> Item: </label>
                <select id="item" v-model="filter.itemId">
                    <option value="">Todos</option>
                    <option :value="item.id" v-for="(item, index) in itemList" :key="`item-${index}`">{{ item.nombre }}
                    </option>
                  </select>
                <button type="submit" class="btn btn-lith">Fitrar</button>
            </form>
        </div>
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Fecha</th>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Monto</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemList2" :key="index">
                    <td>{{ 1 + index }}</td>
                    <td>{{ item.fecha }}</td>
                    <td>{{ item.itemId }}</td>
                    <td>{{ item.cantidad }}</td>
                    <td>{{ item.monto}}</td>
                    <td>
                        <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;">Editar</button>
                        <button @click="Eliminar(item.id)" class="btn btn-danger">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import GastoNewView from './GastoNewView.vue'
import GastoEditView from './GastoEditView.vue'


export default {
    name: 'Gasto',
    data() {
        return {
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            textToFilter: '',
            itemList2: [],
            itemList: [],
            path: '',
            filter: {
                fecha: null,
                itemId:''
            }
        }
    },
    components: {
        // Registro de componentes que se utilizaran.
        Modal,
        GastoNewView,
        GastoEditView
    },
    methods: {
        // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.path = this.baseUrl + "/gastos?_sort=fecha&_order=desc" + this.textToFilter + "&q=" + this.textToSearch;
            this.axios.get(this.baseUrl + "/gastos?_sort=fecha&_order=desc" + this.textToFilter + "&q=" + this.textToSearch)
                .then(function (response) {
                    vm.itemList2 = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        getItemList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/items")
                .then(function (response) {
                    vm.itemList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id) {
            if (confirm("¿Esta Seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/gastos/" + id)
                    .then(function (response) {
                        vm.getList();
                        vm.$toast.show("Registro eliminado.", "danger");
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }

        },
        buscar() {
            this.getList();
        },
        filtrar() {
            this.textToFilter = '';
            if (this.filter.fecha != null && this.filter.fecha != '') {
                this.textToFilter += "&fecha=" + this.filter.fecha;
            }
            if (this.filter.itemId != null && this.filter.itemId != '') {
                this.textToFilter += "&itemId=" + this.filter.itemId;
            }
            this.getList();
        },
        onRegister(event) {
            this.getList();
            this.showModalNuevo = false;
            this.$toast.show('Registro exitoso', 'success');
        },
        onUpdate(event) {
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edicion exitosa', 'info');
        },
        showToast(message, type) {
            this.$toast.show(message, type);
        }
    },
    computed: {
        // propiedades computadas que dependen de otras propiedades reactivas
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl
        }
    },
    props: {
        // propiedades que el componente puede recibir.
    },
    mounted() {
        this.getList();
        this.getItemList();
    },
    emits: [] // los eventos personalizados que el componente puede emitir.
}
</script>
  
<style></style>