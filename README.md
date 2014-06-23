# THAC0 Calc

Super simple THAC0 calculator.

## Usage

```bash
$ git clone https://github.com/wilsonodk/thac0_calc.git
$ ./setup.sh
```

## Player File

It needs a player data file. The easiest way to create this file is to use
the provided script `setup.sh`. 

#### Example File

```javascript
window.player_data = { 
    'Fighter': { 
        'thac0': 20, 
        'bonus': 1,  // Str bonus to-hit
        'weapons': [ 
            { 
                'name': 'Hammer +2', // Weapon label
                'type': 'Hammer',    // Weapon data key
                'bonus': 2           // Magic bonus and/or specialization
            } 
        ] 
    }
};
```
