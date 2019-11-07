<template>
    <md-input-item
            :type="type"
            :title="title"
            :name="name"
            :value="value"
            :placeholder="placeholder"
            v-model="innerValue"
            :error="error"
            :disabled="disabled"
            @blur="onBlur"
            align="right"
    >
    </md-input-item>
</template>

<script>
    import { InputItem } from 'mand-mobile'
    export default {
        components: {
            [InputItem.name]: InputItem,
        },
        props: {
            value: {
                type: String,
                default: ""
            },
            type: {
                type: String,
                default: "text"
            },
            title: {
                type: String,
                default: ""
            },
            name: {
                type: String,
                default: ""
            },
            placeholder: {
                type: String,
                default: ""
            },
            error: {
                type: String,
                default: ""
            },
            disabled: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                innerValue: ""
            };
        },
        watch: {
            innerValue(val) {
                this.$emit("input", val);
            }
        },
        methods: {
            onBlur() {
                this.$emit("blur");
            }
        }
    };
</script>
