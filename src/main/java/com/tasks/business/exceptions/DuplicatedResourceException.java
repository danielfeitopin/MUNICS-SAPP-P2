/*
 *
 * Copyright (c) 2017. DENODO Technologies.
 * http://www.denodo.com
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of DENODO
 * Technologies ("Confidential Information"). You shall not disclose such
 * Confidential Information and shall use it only in accordance with the terms
 * of the license agreement you entered into with DENODO.
 *
 */

package com.tasks.business.exceptions;

public class DuplicatedResourceException extends Exception{

    private static final long serialVersionUID = 6896927410877749980L;

    private final String resource;
    private final String value;

    public DuplicatedResourceException(String resource, String value, String message) {
        super(message);
        this.resource = resource;
        this.value = value;
    }

    public Object getResource() {
        return resource;
    }

    public Object getValue() {
        return value;
    }
    
}
