<template>
    <ValidationObserver tag="v-card" class="elevation-12" ref="obs">
        <template slot-scope="{ invalid, validated }">
            <v-toolbar dark color="primary">
                <v-toolbar-title>VeeValidate Providers</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form>
                    <ValidationProvider name="Name" rules="required|max:10">
                        <template slot-scope="{ errors, valid }">
                            <v-text-field
                                    v-model="name"
                                    :counter="10"
                                    :error-messages="errors"
                                    :success="valid"
                                    label="Name"
                                    required
                            ></v-text-field>
                        </template>
                    </ValidationProvider>
                    <ValidationProvider name="email" rules="required|email">
                        <!-- You can skip the template tag and add slot-scope directly on your inputs -->
                        <v-text-field
                                slot-scope="{ errors, valid }"
                                v-model="email"
                                :error-messages="errors"
                                :success="valid"
                                label="E-mail"
                                required
                        ></v-text-field>
                    </ValidationProvider>

                    <ValidationProvider name="select" rules="required">
                        <v-select
                                slot-scope="{ errors, valid }"
                                :items="items"
                                v-model="select"
                                :error-messages="errors"
                                :success="valid"
                                label="Select"
                                required
                        ></v-select>
                    </ValidationProvider>

                    <ValidationProvider rules="required" name="checkbox">
                        <v-checkbox
                                slot-scope="{ errors, valid }"
                                v-model="checkbox"
                                :error-messages="errors"
                                :success="valid"
                                value="1"
                                label="Option"
                                type="checkbox"
                                required
                        ></v-checkbox>
                    </ValidationProvider>

                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn  @click="clear">Clear</v-btn>
                <v-spacer></v-spacer>
                <v-btn  @click="submit">Validate</v-btn>
                <v-btn color="primary" @click="submit" :disabled="invalid || !validated">Sign Up</v-btn>
            </v-card-actions>
        </template>
    </ValidationObserver>
</template>

<script>
    import { ValidationObserver, ValidationProvider, withValidation } from "vee-validate";

    export default {
        data: () => ({
            items: ["", "Foo", "Bar"],
            name: "",
            email: "",
            select: "",
            checkbox: ""
        }),
        components: {
            ValidationProvider,
            ValidationObserver
        },
        methods: {
            async clear() {
                this.name = this.email = this.select = this.checkbox = "";
                this.$refs.obs.reset();
            },
            async submit() {
                const result = await this.$refs.obs.validate();
            }
        }
    };
</script>
