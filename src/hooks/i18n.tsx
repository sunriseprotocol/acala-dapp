import React, { useContext, ReactNode } from 'react';
import { isEmpty, get, template } from 'lodash';

type Language = 'zh' | 'en';

interface Options {
    language?: Language;
    feedback?: Language;
    i18n: object;
}

const Context = React.createContext<Translator>({} as Translator);

class Translator {
    public language: Language;
    private feedback: Language;
    private i18n: object;

    constructor({ language, feedback = 'en', i18n }: Options) {
        this.language = language ? language : (navigator.language as Language);
        this.feedback = feedback;
        this.i18n = i18n;

        this.getTranslateResult = this.getTranslateResult.bind(this);
        this.translate = this.translate.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
    }

    private getTranslateResult(name: string): string {
        const warn = (name: string, language: string, type: string) => {
            console.warn(
                `can not find i18n config for %c${name}%c, ${type} | ${language}`,
                'color: red',
                'color: inherit',
            );
        };

        // try use this.language
        let result = get(this.i18n, `${this.language}.${name}`);
        if (!isEmpty(result)) {
            return result;
        }

        // try use this.feedback
        warn(name, this.language, 'current');
        result = get(this.i18n, `${this.feedback}.${name}`);
        if (!isEmpty(result)) {
            return result;
        }

        // try use origin name
        warn(name, this.feedback, 'feedback');
        return name;
    }

    public translate(name: string, options?: object): string {
        const result = this.getTranslateResult(name);
        const formatter = template(result, { interpolate: /{{([\s\S]+?)}}/g });
        return formatter(options);
    }

    public setLanguage(language: Language) {
        this.language = language;
    }
}

const useTranslate = () => {
    const translator = useContext(Context);
    return {
        t: translator && translator.translate,
    };
};

interface ProviderProps {
    value: Translator;
    children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ value, children }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { useTranslate, Translator, Provider };